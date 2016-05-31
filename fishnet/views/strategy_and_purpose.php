<?php
/**
 * Created By: cravelo
 * Date: Jan 6, 2011
 * Time: 1:59:24 PM
 */
?>
<!--link rel="stylesheet" href="<?=STATIC_URL?>css/templates/user/30Anniversary.css" /-->

<!--script type="text/javascript" src="<?=STATIC_URL?>js/templates/user/30Anniversary.js"></script-->


<link rel="stylesheet" href="<?=STATIC_URL?>css/templates/includes/sys_team_all.css" />
<section class="primary">
	<?php $this->load->view("page_parts/team_header"); ?>
	<!--?php $this->load->view("page_parts/image_grid_with_thumbnails"); ?-->
	<?php $this->load->view("page_parts/30th_imageGallery_template"); ?>

	<h2 class="b">About us</h2>
	<div class="edit-wysiwygadv team-desc clearfix" data-key="desc">
		<?php echo (isset($revision['revision_text']['desc']) and (!empty($revision['revision_text']['desc']))) ?
			$revision['revision_text']['desc'] : "Enter your team description here."; ?>
	</div>

	<?php $this->load->view("page_parts/team_tabs", array('tabs' => val($tabs, array()))); ?>

	<!--?php $this->load->view("page_parts/team_blog");?-->

</section> <!--/ #primary -->


